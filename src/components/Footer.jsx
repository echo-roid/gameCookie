import { useState } from 'react';
import { Partner } from './modals/Partner';

export function Footer() {

    const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);

    return (
        <>

        
        
        <footer id="page-footer" class="p-2 mt-0 pt-4 pb-2 text-sm">
            <div class="text-center">
                <p class="fw-semibold">These games are brought to you by GamesCookie.</p>
                <p class="text-xs max-w-4xl mx-auto mt-3">GamesCookie is your ultimate destination for exciting and
                    immersive HTML5 games! Our mission is to bring you a diverse collection of online games that are
                    fast, fun, and accessible on any device—whether you're on a PC, tablet, or smartphone. We are
                    passionate about gaming, and deliver high-quality, lag-free experiences without the need for
                    downloads or installations. Whether you're into action, puzzles, reflex, or arcade games, we've got
                    something for everyone. Join us, explore our game library, and experience the thrill of instant
                    gaming—anytime, anywhere!</p>
                <p class="text-xs max-w-4xl mx-auto mt-3">GamesCookie uses cookies from Google to deliver and enhance
                    the quality of its services, to analyze traffic, and to personalize the content and ads that you
                    see. GamesCookie uses Google AdSense to serve the ads that you see.</p>
                <p class="fw-semibold mt-3">🎮 Play. Compete. Have Fun! 🚀</p>
                <div class="mt-2">
                    <div class="d-flex flex-wrap justify-content-center align-items-center gap-sm-5 footer-links">
                        <a href="/about">About</a>
                        <a href="/privacy">Privacy policy</a>
                        <a href="/terms">Terms of use</a>
                        <a href="javascript:void(0)" onClick={()=>setIsPartnerModalOpen(true)}>Partner with us</a>
                    </div>
                    <p class="text-xs mt-3 copy-right">ALL © COPYRIGHTS ARE RESERVED</p>
                </div>
            </div>
        </footer>

        {isPartnerModalOpen &&
        <Partner
            setIsPartnerModalOpen={setIsPartnerModalOpen}
            />
        }
        </>
	);
}