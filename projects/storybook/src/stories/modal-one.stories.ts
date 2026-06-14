import { type Meta, type StoryObj } from '@storybook/angular';

import { ModalOneComponent } from '../../../lib/modal-one/public-api';

const meta: Meta<ModalOneComponent> = {
  title: 'Lib/ModalOne',
  component: ModalOneComponent,
};

export default meta;
type Story = StoryObj<ModalOneComponent>;

export const Default: Story = {};
