import React from 'react';
import PageTitle from './PageTitle';

export default {
    title: 'Example/PaginaTitel',
    component: PageTitle,
}

const Template = (args) => <PageTitle {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  title: "test",
};