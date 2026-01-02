"use client";

import React from "react";
import { categories } from "@/lib/data";
import { BookOpen, Video } from "lucide-react";

interface SubjectListProps {
    categoryId: string;
    onBack: () => void;
    onSelectSubject: (subjectName: string) => void;
}

export default function SubjectList({ categoryId, onBack, onSelectSubject }: SubjectListProps) {
    const category = categories.find(c => c.id === categoryId);

    if (!category) return <div>Category not found</div>;

    return (
        <div>
            <div className="mb-6">
                <button
                    onClick={onBack}
                    className="text-sm text-muted-foreground hover:text-foreground mb-4"
                >
                    ← Back to Categories
                </button>
                <h2 className="text-2xl font-bold">{category.name}</h2>
                <p className="text-muted-foreground">Select a subject to view sessions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.subjects.map((subject) => (
                    <div
                        key={subject.id}
                        className="p-4 rounded-lg border bg-card hover:border-primary transition-colors cursor-pointer group"
                        onClick={() => onSelectSubject(subject.name)}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold group-hover:text-primary transition-colors">{subject.name}</h3>
                            <BookOpen size={16} className="text-muted-foreground" />
                        </div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center text-sm text-muted-foreground gap-2">
                                <Video size={14} />
                                <span>{subject.lectures} Lectures</span>
                            </div>
                            {subject.mentors && subject.mentors.length > 0 && (
                                <div className="text-xs bg-gray-800/60 px-2 py-1 rounded">Mentor: {subject.mentors[0].name}</div>
                            )}
                        </div>

                        {subject.topics && (
                            <div className="text-sm text-muted-foreground mt-2">
                                <strong>Topics:</strong> {subject.topics.slice(0,3).join(', ')}{subject.topics.length > 3 ? '...' : ''}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
