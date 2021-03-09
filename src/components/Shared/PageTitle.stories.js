import React from 'react';
import PageTitle from './PageTitle';

export default {
    title: 'Website/Gedeelde Componenten/Pagina Titel',
    component: PageTitle,
}

const Template = (args) => <PageTitle {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  title: "Pagina Titel",
};