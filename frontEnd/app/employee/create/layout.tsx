"use client"

import React from 'react';

// import { TestContext } from "./context"

export default function TodosLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <section >
            {/* <TestContext> */}
                {children}
            {/* </TestContext> */}
        </section >
    )
}

