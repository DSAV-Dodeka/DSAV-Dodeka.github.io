import React from "react";
import PageTitle from "../Shared/PageTitle";
import "./Socials.css";


function Contact() {
    return (
        <div>
            <PageTitle title="Contact" />
            <div class="flex bg-blauw bg-opacity-90 w-full mb-16">
                <div class="inline my-8 w-1/2">
                    <div class="flex w-full mx-16">
                        <div class="inline w-1/3 space-y-8"> 
                            <h1 class="text-white text-3xl font-bold">Telefoon:</h1>
                            <h1 class="text-white text-3xl font-bold">E-mail:</h1>
                            <h1 class="text-white text-3xl font-bold">Adres:</h1>
                            <h1 class="text-white text-3xl font-bold">AV`40 Website:</h1>

                        </div>
                        <div class="inline w-1/2 space-y-8">
                            <h1 class="text-rood text-3xl font-bold">Nummer</h1>
                            <div><a href="mailto:studentenatletiek@av40.nl" class="text-rood text-3xl font-bold">studentenatletiek@av40.nl</a></div>
                            <h1 class="text-rood text-3xl font-bold">Sportring 12, 2616LK Delft</h1>
                            <div><a target="_blank" rel="noreferrer" href="https://www.av40.nl" class="text-rood text-3xl font-bold">www.av40.nl</a></div>
                        </div>
                    </div>
                    <div class="mt-16 mx-16">
                        <h1 class="text-white text-3xl font-bold">Socials:</h1>
                        <div class="flex mt-2 justify-between w-1/2">
                            <a target="_blank" rel="noreferrer" href="https://www.instagram.com/dsav40/?hl=nl"><svg id="insta" href="www.av40.nl" class="w-12 cursor-pointer fill-current text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><use xlinkHref='www.av40.nl' /><radialGradient id="rg" r="150%" cx="30%" cy="107%">
                                <stop stop-color="#fdf497" offset="0" />
                                <stop stop-color="#fdf497" offset="0.05" />
                                <stop stop-color="#fd5949" offset="0.45" />
                                <stop stop-color="#d6249f" offset="0.6" />
                                <stop stop-color="#285AEB" offset="0.9" />
                            </radialGradient><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                            </a>
                            <a target="_blank" rel="noreferrer" href="https://www.youtube.com/channel/UCrilqur_5aQmpLh-mvXBcmA"><svg id="youtube" class="w-12 cursor-pointer fill-current text-white hover:text-rood" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                            </a>
                            <a target="_blank" rel="noreferrer" href="https://www.facebook.com/DSAV40/">
                                <svg id="facebook" class="w-12 cursor-pointer fill-current text-white hover:text-rood" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                            </a>
                            <a target="_blank" rel="noreferrer" href="#"><svg id="discord" class="w-12 cursor-pointer fill-current text-white " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.54 0c1.356 0 2.46 1.104 2.46 2.472v21.528l-2.58-2.28-1.452-1.344-1.536-1.428.636 2.22h-13.608c-1.356 0-2.46-1.104-2.46-2.472v-16.224c0-1.368 1.104-2.472 2.46-2.472h16.08zm-4.632 15.672c2.652-.084 3.672-1.824 3.672-1.824 0-3.864-1.728-6.996-1.728-6.996-1.728-1.296-3.372-1.26-3.372-1.26l-.168.192c2.04.624 2.988 1.524 2.988 1.524-1.248-.684-2.472-1.02-3.612-1.152-.864-.096-1.692-.072-2.424.024l-.204.024c-.42.036-1.44.192-2.724.756-.444.204-.708.348-.708.348s.996-.948 3.156-1.572l-.12-.144s-1.644-.036-3.372 1.26c0 0-1.728 3.132-1.728 6.996 0 0 1.008 1.74 3.66 1.824 0 0 .444-.54.804-.996-1.524-.456-2.1-1.416-2.1-1.416l.336.204.048.036.047.027.014.006.047.027c.3.168.6.3.876.408.492.192 1.08.384 1.764.516.9.168 1.956.228 3.108.012.564-.096 1.14-.264 1.74-.516.42-.156.888-.384 1.38-.708 0 0-.6.984-2.172 1.428.36.456.792.972.792.972zm-5.58-5.604c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332.012-.732-.54-1.332-1.224-1.332zm4.38 0c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332 0-.732-.54-1.332-1.224-1.332z" /></svg>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="inline w-1/2 px-16">
                    <iframe class="w-full h-full" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2454.7636217944923!2d4.365595816481968!3d52.029403779724376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c5b60b0c9dbfa9%3A0x9fa03ef4a72f1db8!2sDelftse%20Atletiekvereniging%201940!5e0!3m2!1snl!2snl!4v1616071415753!5m2!1snl!2snl" loading="lazy"></iframe>
                </div>
            </div>
        </div>
    )
}

export default Contact;