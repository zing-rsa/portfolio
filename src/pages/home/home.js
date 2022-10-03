import React from 'react';
import { useEffect } from 'react'
import './home.css'

function Home() {

    useEffect(() => {
        var arrow = document.getElementById('arrow');
        var main = document.getElementById('main');
        main.addEventListener('scroll', () => {
            arrow.style.transform = 'translateY(-' + main.scrollTop * (main.scrollTop * 0.01) + 'px)';
            arrow.style.opacity = 1 - (main.scrollTop / 200)
        })
    }, []);

    return (
        <div id='home' className='home-page page'>
            <div className='header-container'>

                <img className='lines' src={'dashes.svg'}></img>
                <div className='name'>
                    <span className='header'>zing</span>
                    <span className='header-sec'>-rsa</span>
                </div>

                <div className='profession'>
                    <div>Full stack</div>

                    <div className='roller'>

                        <span id="rolltext">
                            web<br />
                            integrations<br />
                            blockchain<br />
                            cardano<br />
                        </span>
                    </div>

                    <div>developer</div>
                </div>
            </div>

            <div className='img-container'>
                <img className='zing-head' src={'zing-long.jpg'} />
                {/* <img className='zing-head' src={'zing-long.jpg'} /> */}
            </div>

            <div id='arrow' className='scroll'>
                <i className="fa-solid fa-xl fa-chevron-down"></i>
            </div>
        </div>

    )
}

export default Home;