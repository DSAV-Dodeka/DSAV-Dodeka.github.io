import React from "react";
import "./HomeCommissies.css";
import {
    HashLink as Link
  } from "react-router-hash-link";

function OWeeBar() {
  return (
    <div class="w-full bg-rood lg:h-24 mb-8 lg:mb-24 flex justify-between">
        <h1 class="text-3xl text-white font-bold my-auto ml-16">
            Van 15 tot en met 20 augustus staan wij op de OWee!
        </h1>
        <div class="bg-white h-16 w-1 my-auto"></div>
        <Link class="mr-16 my-auto flex" to="/owee#">
            <h1 class="text-3xl text-white font-bold">
                Bekijk hier wat wij doen op de OWee
            </h1>
            <svg xmlns="http://www.w3.org/2000/svg" class="ml-4 my-auto w-8 h-8 text-white pt-1 fill-current" viewBox="0 0 24 24"><path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" /></svg>
        </Link>
    </div>
  );
}

export default OWeeBar;