import { useEffect } from 'react';
import './nav.css'


function Nav() {

    useEffect( () => {
        var main = document.getElementById('main');
        var back = document.getElementById('back');
        var nav  = document.getElementById('nav');

        main.addEventListener('scroll', () => {
            if (main.scrollTop > 100 ){
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
            <div id='back' className='hide'></div>
            <div className='nav-list'>
                <div className='nav-list-item'>Intro</div>
                <div className='nav-list-item'>Work</div>
                <div className='nav-list-item'>Projects</div>
                <div className='nav-list-item'>Other</div>
            </div>
        </div>
    )

}

export default Nav; 