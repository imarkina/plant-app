import type { Meta, StoryObj } from '@storybook/react-vite';


import { Button } from '../shared/ui/components/Button/Button';

const meta = {
  title: 'Example/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    label: 'Анализировать',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    label: 'Отмена',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    label: 'Анализировать',
  },
};
