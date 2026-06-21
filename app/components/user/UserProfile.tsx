"use client";

import { useState } from "react";

export default function Profile({isProfileOpen}: {isProfileOpen: boolean}) {
    return (
        <>
            {isProfileOpen && (
                <div className="absolute top-16 right-0 bg-white shadow-lg rounded-lg p-4">
                    <h2>User Profile</h2>
                    <p>Welcome to your profile!</p>
                </div>
            )}
        </>
    )
}