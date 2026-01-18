import { useState } from 'react';
import { useFilters } from '../../contexts/FilterContext';
import { mockFamilyMembers } from '../../data/mockFamilyMembers';
import { FamilyMember } from '../../types';
import { AddMemberModal } from '../modals/AddMemberModal';

export const FamilyMembersWidget = () => {
  const { memberId, setMemberId } = useFilters();
  const [isAddingMember, setIsAddingMember] = useState(false);

  const handleMemberClick = (id: string) => {
    if (memberId === id) {
      setMemberId(null);
    } else {
      setMemberId(id);
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (member: FamilyMember): string => {
    if (member.id === '1') return 'bg-primary-500';
    if (member.id === '2') return 'bg-secondary-50';
    return 'bg-gray-300';
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center -space-x-2">
        {mockFamilyMembers.map((member, index) => {
          const isSelected = memberId === member.id;
          return (
            <button
              key={member.id}
              onClick={() => handleMemberClick(member.id)}
              className={`relative w-10 h-10 lg:w-11 lg:h-11 rounded-full border-2 transition-all avatar-hover hover:z-10 ${
                isSelected
                  ? 'border-secondary-900 z-10 scale-110'
                  : 'border-surface-500'
              } ${getAvatarColor(member)} flex items-center justify-center text-label-sm font-bold text-secondary-900`}
              style={{
                marginLeft: index > 0 ? '-8px' : '0',
              }}
            >
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                getInitials(member.name)
              )}
              {isSelected && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-surface-500 flex items-center justify-center">
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => setIsAddingMember(true)}
        className="w-10 h-10 lg:w-11 lg:h-11 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-primary-500 hover:text-primary-500 transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        aria-label="Adicionar membro da família"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      {/* Modal de adicionar membro */}
      <AddMemberModal
        isOpen={isAddingMember}
        onClose={() => setIsAddingMember(false)}
        onMemberAdded={(newMember) => {
          // O membro já foi adicionado ao array mock
          console.log('Novo membro adicionado:', newMember);
        }}
      />
    </div>
  );
};
