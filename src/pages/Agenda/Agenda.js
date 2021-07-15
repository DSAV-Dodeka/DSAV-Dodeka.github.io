import React from "react";
import PageTitle from "../../components/PageTitle";

function Agenda() {
    return (
        <div>
            <PageTitle title="Agenda" />
            <div class="w-full px-4 lg:px-16 h-128 mb-16 lg:mb-24">
                <iframe title="Baan" loading="lazy" referrerPolicy="no-referrer" class="h-full w-full cursor-pointer" src="https://calendar.google.com/calendar/embed?src=c_6381o0tk6k7corm9n4mr7aibh4%40group.calendar.google.com&ctz=Europe%2FAmsterdam"></iframe>
            </div>
        </div>

    )
}

export default Agenda;