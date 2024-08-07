"use client";

import { useRouter } from "next/navigation";
import Button from "./Button";

type Props = {
    startCursor: string;
    endCursor: string;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

const LoadMore = ({ startCursor, endCursor, hasPreviousPage, hasNextPage }: Props) => {
    const router = useRouter();

    const handleNavigation = (type: string) => {
        const currentParams = new URLSearchParams(window.location.search);
        
        if (type === "prev" && hasPreviousPage) {
            currentParams.set("startcursor", startCursor);
            currentParams.delete("endcursor");
        } else if (type === "next" && hasNextPage) {
            currentParams.set("endcursor", endCursor);
            currentParams.delete("startcursor");
        }
    
        const newSearchParams = currentParams.toString();
        const newPathname = `${window.location.pathname}?${newSearchParams}`;
    
        router.push(newPathname);
    };

    return (
        <div className="w-full flexCenter gap-5 mt-10">
            {hasPreviousPage && (
                <Button title="First Page" handleClick={() => handleNavigation('prev')} />
            )}
            {hasNextPage && (
                <Button title="Next Shots" handleClick={() => handleNavigation('next')} />
            )}
        </div>
    );
};

export default LoadMore;
