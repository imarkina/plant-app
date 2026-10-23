import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../shared/ui/components/Badge/Badge';

const meta = {
  title: 'Example/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Отлично',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Плохо',
  },
};

export const Neutral: Story = {
  args: {
    variant: 'neutral',
    children: 'Нормально',
  },
};
