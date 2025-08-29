import React, { useState } from "react";
import ExitButton from "../../components/circle-exit-button/circle-exit-button";
import "./lista-convites.css";

export default function ListaConvites() {
    return (
        <div className="lista-convites-wrapper">
            <div className="lista-convites-container">
                <div className="lista-convites-content">
                    <div className="lista-convites-header">
                        <span>Veja aqui seus convites</span>
                        <ExitButton />
                    </div>
                    <div className="lista-convites-body">
                        <div className="lista-convites-item">
                            <div className="lista-convites-info">
                                <span className="lista-convites-nome">Pedro</span>
                                <span className="lista-convites-data">Nome da Trilha</span>
                            </div>
                            <div className="lista-convites-btns">
                                <div className="lista-convites-btn-green">
                                    <span>Aceitar</span>
                                </div>
                                <div className="lista-convites-btn-red">
                                    <span>Recusar</span>
                                </div>
                            </div>
                        </div>
                        <div className="lista-convites-item">
                            <div className="lista-convites-info">
                                <span className="lista-convites-nome">Pedro</span>
                                <span className="lista-convites-data">Nome da Trilha</span>
                            </div>
                            <div className="lista-convites-btns">
                                <div className="lista-convites-btn-green">
                                    <span>Aceitar</span>
                                </div>
                                <div className="lista-convites-btn-red">
                                    <span>Recusar</span>
                                </div>
                            </div>
                        </div>
                        <div className="lista-convites-item">
                            <div className="lista-convites-info">
                                <span className="lista-convites-nome">Pedro</span>
                                <span className="lista-convites-data">Nome da Trilha</span>
                            </div>
                            <div className="lista-convites-btns">
                                <div className="lista-convites-btn-green">
                                    <span>Aceitar</span>
                                </div>
                                <div className="lista-convites-btn-red">
                                    <span>Recusar</span>
                                </div>
                            </div>
                        </div>
                        <div className="lista-convites-item">
                            <div className="lista-convites-info">
                                <span className="lista-convites-nome">Pedro</span>
                                <span className="lista-convites-data">Nome da Trilha</span>
                            </div>
                            <div className="lista-convites-btns">
                                <div className="lista-convites-btn-green">
                                    <span>Aceitar</span>
                                </div>
                                <div className="lista-convites-btn-red">
                                    <span>Recusar</span>
                                </div>
                            </div>
                        </div>
                        <div className="lista-convites-item">
                            <div className="lista-convites-info">
                                <span className="lista-convites-nome">Pedro</span>
                                <span className="lista-convites-data">Nome da Trilha</span>
                            </div>
                            <div className="lista-convites-btns">
                                <div className="lista-convites-btn-green">
                                    <span>Aceitar</span>
                                </div>
                                <div className="lista-convites-btn-red">
                                    <span>Recusar</span>
                                </div>
                            </div>
                        </div>
                        <div className="lista-convites-item">
                            <div className="lista-convites-info">
                                <span className="lista-convites-nome">Pedro</span>
                                <span className="lista-convites-data">Nome da Trilha</span>
                            </div>
                            <div className="lista-convites-btns">
                                <div className="lista-convites-btn-green">
                                    <span>Aceitar</span>
                                </div>
                                <div className="lista-convites-btn-red">
                                    <span>Recusar</span>
                                </div>
                            </div>
                        </div>
                        <div className="lista-convites-item">
                            <div className="lista-convites-info">
                                <span className="lista-convites-nome">Pedro</span>
                                <span className="lista-convites-data">Nome da Trilha</span>
                            </div>
                            <div className="lista-convites-btns">
                               <div className="lista-convites-btn-gray">
                                   <span>Aceito</span>
                               </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
