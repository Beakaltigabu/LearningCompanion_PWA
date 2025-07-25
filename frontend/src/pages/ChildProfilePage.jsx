import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MascotGallery from '../components/child-profile/MascotGallery';
import MascotCustomizationOptions from '../components/child-profile/MascotCustomizationOptions';
import { getChildProfile, updateChildCustomization } from '../services/childService';

const ChildProfilePage = () => {
    const { childId } = useParams();
    const queryClient = useQueryClient();
    const { data, isLoading, error } = useQuery({ queryKey: ['child', childId], queryFn: () => getChildProfile(childId), enabled: !!childId });
    const [customization, setCustomization] = useState(null);
    useEffect(() => {
        if (data?.data) {
            setCustomization({
                color: data.data.mascot_color || '#FFD700',
                accessory: data.data.mascot_accessory || '',
            });
        }
    }, [data]);
    const mutation = useMutation({
        mutationFn: (custom) => updateChildCustomization(childId, custom),
        onSuccess: () => queryClient.invalidateQueries(['child', childId]),
    });
    if (isLoading) return <div>Loading profile...</div>;
    if (error) return <div>Error loading profile</div>;
    const child = data?.data || {};
    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">My Profile</h1>
            <div className="mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold">
                        {child.name?.[0] || '?'}
                    </div>
                    <div>
                        <div className="font-semibold text-lg">{child.name}</div>
                        <div className="text-gray-500">Points: {child.points || 0} | Grade: {child.grade_level}</div>
                    </div>
                </div>
            </div>
            <MascotGallery onSelectMascot={() => { }} selectedMascotId={child.mascot_id} />
            <MascotCustomizationOptions onChange={setCustomization} color={customization?.color} accessory={customization?.accessory} />
            <button
                className="mt-4 bg-blue-500 text-white rounded px-4 py-1"
                onClick={() => mutation.mutate(customization)}
                disabled={mutation.isLoading || !customization}
            >
                {mutation.isLoading ? 'Saving...' : 'Save Customization'}
            </button>
            {mutation.isError && <div className="text-red-500 mt-2">Error saving customization</div>}
            {mutation.isSuccess && <div className="text-green-600 mt-2">Customization saved!</div>}
            {/* TODO: Achievements, progress, app settings */}
        </div>
    );
};
export default ChildProfilePage;
