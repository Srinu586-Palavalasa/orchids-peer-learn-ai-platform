"use client";

import React from "react";
import { categories } from "@/lib/data";
import { Calculator, Code, Atom } from "lucide-react";

const iconMap: any = {
    Calculator: <Calculator size={28} />,
    Code: <Code size={28} />,
    Atom: <Atom size={28} />,
};

interface CategoryListProps {
    onSelectCategory: (categoryId: string) => void;
}

export default function CategoryList({ onSelectCategory }: CategoryListProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((category) => (
                <div
                    key={category.id}
                    className="relative group overflow-hidden rounded-2xl cursor-pointer transform transition hover:-translate-y-1 shadow-lg"
                    onClick={() => onSelectCategory(category.id)}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="p-6 bg-card border border-border rounded-2xl h-full flex flex-col justify-between">
                        <div>
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-accent text-white mb-4 shadow-md">
                                {iconMap[category.icon]}
                            </div>
                            <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
                            <p className="text-sm text-muted-foreground">{category.subjects.length} Subjects</p>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">Explore topics & mentors</div>
                            <div className="px-3 py-1 rounded-full bg-primary text-white text-xs font-medium">Browse</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
