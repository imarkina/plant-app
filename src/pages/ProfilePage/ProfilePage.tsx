import { CircleUser, LogOut } from 'lucide-react';
import { useAuthContext } from '../../features/auth';
import { Button } from '../../shared/ui/components/Button/Button';
import { Card } from '../../shared/ui/components/Card/Card';
import { BottomNav } from '../../shared/ui/components/BottomNav/BottomNav';
import { formatDate } from '../../shared/helpers';
import './ProfilePage.css';

export const ProfilePage = () => {
  const { user, signOut } = useAuthContext();

  return (
    <div>
      <h1 className="profile-page__title">Профиль</h1>

      <Card>
        <div className="profile-page__user">
          <div className="profile-page__avatar">
            <CircleUser size={28} />
          </div>
          <div>
            <span className="profile-page__email">{user?.email ?? '—'}</span>
            {user?.createdAt && (
              <span className="profile-page__meta">
                На платформе с {formatDate(new Date(user.createdAt).getTime())}
              </span>
            )}
          </div>
        </div>

        <div className="profile-page__signout">
          <Button type="button" variant="secondary" onClick={() => void signOut()}>
            <LogOut size={18} />
            Выйти
          </Button>
        </div>
      </Card>

      <BottomNav />
    </div>
  );
};
