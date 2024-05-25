import React from 'react';
import Avatar from 'react-avatar';

type UserCardProps = {
  photo: string;
  name: string;
};

const UserCard: React.FC<UserCardProps> = ({ photo, name }) => {
  return (
    <div className="position-relative">
      <div className="card user-card">
        <div className="card-body d-flex align-items-center">
          <div className="user-card__circle me-3">
            <Avatar name={name} size='50'> </Avatar>
          </div>
          <div>
            <h5 className="card-title mb-0">{name}</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
