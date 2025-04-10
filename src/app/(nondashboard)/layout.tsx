'use client';
import React from 'react';
import { NAVBAR_HEIGHT } from '@/lib/constants';
import Navbar from '@/components/Navbar';
import { useGetAuthUsersQuery } from '@/state/api'; // Adjust the path as needed

const Layout = ({children}: {children: React.ReactNode}) =>{ 


    const {data: authUser} = useGetAuthUsersQuery()
    console.log("Auth User", authUser)
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

export default Layout;