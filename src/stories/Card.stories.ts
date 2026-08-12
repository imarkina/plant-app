import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '../shared/ui/components/Card/Card';

const meta = {
  title: 'Example/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Заголовок секции',
    children: 'Контент контент контент',
  },
};
