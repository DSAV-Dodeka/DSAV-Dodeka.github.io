import React from "react";
import PageTitle from "../../components/PageTitle";
import indoor from "../../images/wedstrijden/nskindoor.png";
import indoor2 from "../../images/wedstrijden/indoor2.JPG";
import "./Wedstrijd.scss";

function Wedstrijd() {
    return(
        <div>
            <PageTitle title="NSK Indoor"/>
            <img src={indoor} alt="" class="wedstrijdFoto"/>
            <img src={indoor2} alt="" class="wedstrijdFoto"/>
            <p class="wedstrijdDatum">12/03/2022</p>
            <p class="wedstrijdInfo">

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse quis fringilla arcu. Proin tempor lorem vel facilisis posuere. Nullam et venenatis ante. Proin a diam nisi. In hac habitasse platea dictumst. Aliquam vitae ipsum nibh. Donec in erat eleifend, volutpat ex eu, dictum erat. Pellentesque posuere arcu ac sem consectetur, sed viverra ex euismod. Phasellus et sapien eu est aliquet hendrerit ut sed quam. Aliquam imperdiet, sem vel rhoncus hendrerit, leo erat tincidunt massa, vel elementum sem tortor a massa.

Fusce malesuada libero sed neque ornare, eu pretium orci porttitor. Nam rhoncus pellentesque tincidunt. Mauris sed feugiat metus, eu vehicula felis. Sed tempor feugiat risus, a pulvinar dolor finibus a. Praesent vitae ligula nec nisi sodales maximus eu rhoncus magna. Integer tempus est nibh, vel lacinia nibh placerat ut. Aenean pulvinar aliquam velit eu mollis. Nunc at turpis sodales, mattis turpis eu, pharetra purus. Cras ut facilisis lacus, quis dapibus dolor. Phasellus vehicula pellentesque mi, malesuada ultrices diam tincidunt feugiat. Nam tempus lectus metus, eu ornare diam hendrerit id. Morbi iaculis metus dapibus tempor condimentum. Suspendisse ac lectus at mauris euismod rhoncus. In vitae nisi vitae mi varius posuere et vel justo. Nulla facilisi. Praesent feugiat mattis tincidunt.

Quisque malesuada blandit elit ac maximus. Phasellus a urna urna. Etiam in vestibulum diam. Morbi venenatis mollis tempor. Curabitur porta pulvinar magna vitae luctus. Mauris ac euismod elit, aliquet accumsan metus. Ut dapibus, nulla vel imperdiet vestibulum, mi nunc tristique mi, a pellentesque elit arcu id ante. Aliquam turpis libero, iaculis in dui sed, rutrum volutpat dolor. Aenean at commodo arcu, eu varius orci. Aliquam nec fermentum diam, vitae sollicitudin purus. Suspendisse pellentesque odio efficitur purus rutrum finibus. Nunc cursus nisl felis, at porta sapien rhoncus a. Curabitur interdum tempus tellus non pretium. Pellentesque at pulvinar velit.

Fusce feugiat tortor lectus, quis tempus orci consequat et. Sed mollis augue fringilla gravida consequat. Morbi dignissim justo eu enim vestibulum, ut molestie sem rutrum. Nullam ac nisl sit amet ex consequat ultricies. Nunc ultricies maximus urna eu volutpat. Duis euismod gravida lectus id cursus. In lacinia laoreet sagittis. Sed a nulla sit amet ipsum bibendum consectetur sed eu nulla. Nunc sollicitudin facilisis metus, et sollicitudin enim vehicula et.

Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur non quam sed arcu fermentum feugiat at et ante. Curabitur dapibus mauris dolor, vel faucibus mauris faucibus at. Donec porttitor dapibus velit, laoreet feugiat velit hendrerit id. Morbi aliquam sit amet lorem et mattis. Ut dolor urna, viverra at neque vel, hendrerit vulputate metus. Integer nec elit sed magna dictum interdum sit amet ut libero. Fusce arcu odio, gravida in dictum vel, eleifend ut erat. Proin in dignissim enim. Nulla vehicula ullamcorper mauris elementum facilisis. Pellentesque maximus egestas dolor, quis tempor libero fermentum vitae. Praesent sem ligula, posuere nec convallis blandit, laoreet a erat. Nulla facilisi. Nullam commodo nibh et mi posuere tempor. Suspendisse congue ante id mollis scelerisque. </p>
        </div>
    )
}

export default Wedstrijd;