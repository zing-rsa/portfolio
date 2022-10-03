import { useEffect } from 'react';
import './nav.css'

function Nav() {

    useEffect(() => {

        var main = document.getElementById('main');
        var back = document.getElementById('back');
        var nav = document.getElementById('nav');

        main.addEventListener('scroll', () => {
            if (main.scrollTop > 100) {
                back.classList.add('show');
                back.classList.remove('hide');
                nav.classList.add('small');
            } else {
                back.classList.remove('show');
                back.classList.add('hide');
                nav.classList.remove('small');
            }
        });

    }, []);


    return (
        <div id='nav' className='nav-container'>
            <div id='back' className='hide'>
                <div className='nav-name'>
                    <a href='#home'>zing-rsa</a>
                </div>
                <div className='back-left'></div>
                <div className='back-right'></div>
            </div>
            <div className='nav-list'>
                <div className='nav-list-item'>
                    <a href='#intro'>Intro</a>
                </div>
                <div className='nav-list-item'>
                    <a href='#work'>Work</a>
                </div>
                <div className='nav-list-item'>
                    <a href='#projects'>Projects</a>
                </div>
                <div className='nav-list-item'>
                    <a href='#other'>Other</a>
                </div>

            </div>
            <div className='nav-socials'>
                <div className='nav-social'>
                    <i className='fa-brands fa-instagram'></i>
                </div>
                <div className='nav-social'>
                    <i className='fa-brands fa-twitter'></i>
                </div>
                <div className='nav-social'>
                    <i className='fa-brands fa-discord'></i>
                </div>
            </div>
        </div>
    )

}

export default Nav; 