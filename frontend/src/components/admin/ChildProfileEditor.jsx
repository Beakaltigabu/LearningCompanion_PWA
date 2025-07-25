import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getMascots } from '../../services/mascotService';
import { createChild, updateChildProfile } from '../../services/childService';

const schema = z.object({
    name: z.string().min(2),
    age: z.number().min(1),
    grade_level: z.string().min(1),
    pin: z.string().min(4).max(6),
    mascot_id: z.string().uuid(),
});

const ChildProfileEditor = ({ child = {}, onClose, mascots: mascotsProp, onSaved }) => {
    const isEdit = Boolean(child.id);
    const { data: mascotsData } = useQuery({ queryKey: ['mascots'], queryFn: getMascots, enabled: !mascotsProp });
    const mascots = mascotsProp || mascotsData?.data || [];
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: child.name || '',
            age: child.age || '',
            grade_level: child.grade_level || '',
            pin: '',
            mascot_id: child.mascot_id || (mascots[0]?.mascot_id || ''),
        },
    });
    const mutation = useMutation({
        mutationFn: (data) => isEdit ? updateChildProfile(child.id, data) : createChild(data),
        onSuccess: () => {
            if (onSaved) onSaved();
            if (onClose) onClose();
        },
    });
    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <form className="bg-white p-6 rounded-xl shadow-xl min-w-[300px]" onSubmit={handleSubmit(mutation.mutate)}>
                <h2 className="font-bold mb-2">{isEdit ? 'Edit Child' : 'Add New Child'}</h2>
                <input {...register('name')} placeholder="Name" className="block mb-2 w-full" />
                {errors.name && <div className="text-red-500 text-xs mb-1">{errors.name.message}</div>}
                <input {...register('age', { valueAsNumber: true })} type="number" placeholder="Age" className="block mb-2 w-full" />
                {errors.age && <div className="text-red-500 text-xs mb-1">{errors.age.message}</div>}
                <input {...register('grade_level')} placeholder="Grade" className="block mb-2 w-full" />
                {errors.grade_level && <div className="text-red-500 text-xs mb-1">{errors.grade_level.message}</div>}
                <input {...register('pin')} type="password" placeholder="PIN" className="block mb-2 w-full" />
                {errors.pin && <div className="text-red-500 text-xs mb-1">{errors.pin.message}</div>}
                <label className="block mb-1 font-medium">Mascot</label>
                <select {...register('mascot_id')} className="rounded-lg border px-2 py-1 mb-2 w-full">
                    {mascots.map(m => (
                        <option key={m.mascot_id} value={m.mascot_id}>{m.name}</option>
                    ))}
                </select>
                {errors.mascot_id && <div className="text-red-500 text-xs mb-1">{errors.mascot_id.message}</div>}
                {/* TODO: Notification preferences */}
                <div className="flex gap-2 mt-4">
                    <button type="submit" className="bg-blue-500 text-white rounded px-4 py-1">Save</button>
                    <button type="button" onClick={onClose} className="bg-gray-200 rounded px-4 py-1">Cancel</button>
                </div>
            </form>
        </div>
    );
};
export default ChildProfileEditor;
