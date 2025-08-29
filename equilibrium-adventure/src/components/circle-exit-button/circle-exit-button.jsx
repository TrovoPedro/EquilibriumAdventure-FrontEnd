import React from "react";
import "./circle-exit-button.css"
import { X} from 'lucide-react'

export default function CircleExitButton({ onClick }) {
    return (
        <button className="circle-exit-button" onClick={onClick}>
            <div className="exit-icon">
                <X size={32} strokeWidth={2} />
            </div>
            
        </button>
    );
}