import React, { useState } from 'react';
const accessories = [
    { label: 'None', value: '' },
    { label: 'Hat', value: 'hat' },
    { label: 'Glasses', value: 'glasses' },
    { label: 'Bowtie', value: 'bowtie' },
];

const MascotCustomizationOptions = ({ onChange, color: colorProp, accessory: accessoryProp }) => {
    const [color, setColor] = useState(colorProp ?? '#FFD700');
    const [accessory, setAccessory] = useState(accessoryProp ?? '');

    // Sync internal state with props
    React.useEffect(() => {
        if (colorProp !== undefined && colorProp !== color) setColor(colorProp);
    }, [colorProp]);
    React.useEffect(() => {
        if (accessoryProp !== undefined && accessoryProp !== accessory) setAccessory(accessoryProp);
    }, [accessoryProp]);

    // Call onChange if provided (for parent state sync)
    React.useEffect(() => {
        if (onChange) onChange({ color, accessory });
    }, [color, accessory, onChange]);

    return (
        <div className="mt-6 p-4 bg-white rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-2">Customize Your Mascot</h2>
            <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Color Picker */}
                <div>
                    <label className="block mb-1 font-medium">Color</label>
                    <input
                        type="color"
                        value={color}
                        onChange={e => setColor(e.target.value)}
                        className="w-12 h-12 p-0 border-none bg-transparent cursor-pointer"
                        aria-label="Pick mascot color"
                    />
                </div>
                {/* Accessory Selector */}
                <div>
                    <label className="block mb-1 font-medium">Accessory</label>
                    <select
                        value={accessory}
                        onChange={e => setAccessory(e.target.value)}
                        className="rounded-lg border px-2 py-1"
                    >
                        {accessories.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                {/* Live Preview */}
                <div className="flex flex-col items-center">
                    <span className="mb-1 font-medium">Preview</span>
                    <div
                        className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-gray-300 relative"
                        style={{ backgroundColor: color }}
                    >
                        {/* Accessory SVG overlays */}
                        {accessory === 'hat' && (
                            <svg width="40" height="20" className="absolute top-0 left-1/2 -translate-x-1/2" viewBox="0 0 40 20"><ellipse cx="20" cy="10" rx="18" ry="8" fill="#333" /></svg>
                        )}
                        {accessory === 'glasses' && (
                            <svg width="40" height="20" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" viewBox="0 0 40 20"><circle cx="12" cy="10" r="6" stroke="#333" strokeWidth="2" fill="none" /><circle cx="28" cy="10" r="6" stroke="#333" strokeWidth="2" fill="none" /><line x1="18" y1="10" x2="22" y2="10" stroke="#333" strokeWidth="2" /></svg>
                        )}
                        {accessory === 'bowtie' && (
                            <svg width="32" height="16" className="absolute bottom-0 left-1/2 -translate-x-1/2" viewBox="0 0 32 16"><polygon points="0,8 8,0 8,16" fill="#c00" /><polygon points="32,8 24,0 24,16" fill="#c00" /><rect x="12" y="6" width="8" height="4" fill="#c00" /></svg>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default MascotCustomizationOptions;
