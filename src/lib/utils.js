import clsx from 'clsx';
import { customAlphabet } from 'nanoid';
import { twMerge } from 'tailwind-merge';


export function cn(inputs) {
    return twMerge(clsx(inputs));
}

export const nanoid = customAlphabet(
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    7
); // 7-character random string

export async function fetcher(input, init) {
    const res = await fetch(input, init);

    if (!res.ok) {
        const json = await res.json();
        const error = new Error(json.error ? json.error : 'An unexpected error occurred');
        error.status = res.status;
        throw error;
    }
    return res.json();
}

export function formatDate(input) {
    const date = new Date(input);
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

