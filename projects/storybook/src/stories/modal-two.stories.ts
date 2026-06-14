import { type Meta, type StoryObj } from '@storybook/angular';

import { ModalTwoComponent } from '../../../lib/modal-two/public-api';

const meta: Meta<ModalTwoComponent> = {
  title: 'Lib/ModalTwo',
  component: ModalTwoComponent,
};

export default meta;
type Story = StoryObj<ModalTwoComponent>;

export const Default: Story = {};
