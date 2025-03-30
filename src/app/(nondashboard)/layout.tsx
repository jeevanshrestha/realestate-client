import React from 'react';
import { NAVBAR_HEIGHT } from '@/lib/constants';
import Navbar from '@/components/Navbar';

export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <div className="h-full w-full">
        <Navbar />
            <main className={` relative h-full flex w-full flex-col`}
            style={{paddingTop: `${NAVBAR_HEIGHT}px`}}>
            {children}
            </main>
        </div>
    );
}