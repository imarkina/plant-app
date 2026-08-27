import { useCareTasks } from '../hooks/useCareTasks';
import { CareTaskItem } from './CareTaskItem';
import { createDefaultTasks } from '../models/care-tasks.helpers';
import './CareTab.css';
import type { CareTask } from '../models/care-tasks.model';

type Props = {
  plantId: string;
  onPhotoSelected: (task: CareTask, file: File) => void;
};

export const CareTab = ({ plantId, onPhotoSelected }: Props) => {
  const { tasks, loading, markDone, addTask } = useCareTasks(plantId);

  if (loading) return <p>Загрузка...</p>;

  if (tasks.length === 0) {
    return (
      <div className="care-empty">
        <p>Задачи ухода ещё не настроены</p>
        <button onClick={() => createDefaultTasks(plantId, addTask)}>Создать план ухода</button>
      </div>
    );
  }

  return (
    <div className="care-list">
      {tasks.map((task) => (
        <CareTaskItem
          key={task.id}
          task={task}
          onDone={() => markDone(task.id)}
          onPhotoSelected={onPhotoSelected}
        />
      ))}
    </div>
  );
};
