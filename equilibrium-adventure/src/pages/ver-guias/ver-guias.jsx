import React from "react";
import './ver-guias.css';
import leftArrow from "../../assets/left-arrow-green.png";
import Header from "../../components/header/header-unified";

export default function VerGuias() {

    return (
        <>
            <Header></Header>
            <div className="ver-guias-container">
                <div className="ver-guias-header">
                    <span className="back-arrow-circle">
                        <img className="back-arrow" src={leftArrow} alt="Voltar" />
                    </span>
                    <h1 className="ver-guias-title">Ver Guias</h1>
                </div>
                <div className="ver-guias-body">
                        <div className="ver-guias-item">
                            <div className="ver-guias-info">
                                <span className="ver-guias-nome">Pedro</span>
                            </div>
                            <div className="ver-guias-btns">
                                <div className="ver-guias-btn-green">
                                    <span>Mais Informações</span>
                                </div>
                                <div className="ver-guias-btn-red">
                                    <span>Remover</span>
                                </div>
                            </div>
                        </div>
                        <div className="ver-guias-item">
                            <div className="ver-guias-info">
                                <span className="ver-guias-nome">Pedro</span>
                            </div>
                            <div className="ver-guias-btns">
                                <div className="ver-guias-btn-green">
                                    <span>Mais Informações</span>
                                </div>
                                <div className="ver-guias-btn-red">
                                    <span>Remover</span>
                                </div>
                            </div>
                        </div>
                        <div className="ver-guias-item">
                            <div className="ver-guias-info">
                                <span className="ver-guias-nome">Pedro</span>
                            </div>
                            <div className="ver-guias-btns">
                                <div className="ver-guias-btn-green">
                                    <span>Mais Informações</span>
                                </div>
                                <div className="ver-guias-btn-red">
                                    <span>Remover</span>
                                </div>
                            </div>
                        </div>
                        <div className="ver-guias-item">
                            <div className="ver-guias-info">
                                <span className="ver-guias-nome">Pedro</span>
                            </div>
                            <div className="ver-guias-btns">
                                <div className="ver-guias-btn-green">
                                    <span>Mais Informações</span>
                                </div>
                                <div className="ver-guias-btn-red">
                                    <span>Remover</span>
                                </div>
                            </div>
                        </div>
                        <div className="ver-guias-item">
                            <div className="ver-guias-info">
                                <span className="ver-guias-nome">Pedro</span>
                            </div>
                            <div className="ver-guias-btns">
                                <div className="ver-guias-btn-green">
                                    <span>Mais Informações</span>
                                </div>
                                <div className="ver-guias-btn-red">
                                    <span>Remover</span>
                                </div>
                            </div>
                        </div>
                        <div className="ver-guias-item">
                            <div className="ver-guias-info">
                                <span className="ver-guias-nome">Pedro</span>
                            </div>
                            <div className="ver-guias-btns">
                                <div className="ver-guias-btn-green">
                                    <span>Mais Informações</span>
                                </div>
                                <div className="ver-guias-btn-red">
                                    <span>Remover</span>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </>
    )

}