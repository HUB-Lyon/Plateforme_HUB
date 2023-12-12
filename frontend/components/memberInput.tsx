// MemberInput.tsx
import React from 'react';

interface MemberInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onAdd: () => void;
}

const MemberInput: React.FC<MemberInputProps> = ({ value, onChange, onKeyDown, onAdd }) => {
    return (
        <div className="flex mt-2">
            <input
                type="text"
                id="members"
                name="newMembers"
                className="mr-2 form-box"
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
            />
            <button type="button" className="bg-blue-500 text-white text-sm p-1 rounded-md" onClick={onAdd}>
                Add
            </button>
        </div>
    );
};

export default MemberInput;
