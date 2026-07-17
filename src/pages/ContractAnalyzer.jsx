import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContractAnalyzerPanel from '../components/ai/ContractAnalyzerPanel';
import AppHeader from '../components/AppHeader';
import useMediaQuery from '../hooks/useMediaQuery';

const ContractAnalyzer = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 720px)');

    return (
        <div style={pageStyle}>
            <AppHeader />

            <main
                style={{
                    ...mainStyle,
                    ...(isMobile
                        ? mobileMainStyle
                        : null)
                }}
            >
                <div
                    style={{
                        ...contentStyle,
                        ...(isMobile
                            ? mobileContentStyle
                            : null)
                    }}
                >
                    <button
                        type="button"
                        style={{
                            ...backButtonStyle,
                            ...(isMobile
                                ? mobileBackButtonStyle
                                : null)
                        }}
                        onClick={() => navigate('/guide')}
                    >
                        ‹ 근로기준법 안내로 돌아가기
                    </button>

                    <ContractAnalyzerPanel />
                </div>
            </main>
        </div>
    );
};

const pageStyle = {
    minHeight: '100dvh',
    backgroundColor: '#F6F8FB'
};

const headerStyle = {
    height: '64px',
    padding: '0 22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E8EDF4',
    boxSizing: 'border-box'
};

const leftHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap'
};

const brandButtonStyle = {
    padding: 0,
    backgroundColor: 'transparent',
    border: 'none',
    color: '#121826',
    cursor: 'pointer',
    fontSize: '17px',
    fontWeight: '900'
};

const navButtonStyle = {
    padding: '0 6px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#596274',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
};

const loginButtonStyle = {
    height: '38px',
    minWidth: '132px',
    padding: '0 16px',
    backgroundColor: '#FEE500',
    border: 'none',
    borderRadius: '12px',
    color: '#191919',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '800'
};

const logoutButtonStyle = {
    height: '38px',
    minWidth: '108px',
    padding: '0 16px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE2EB',
    borderRadius: '12px',
    color: '#4E5968',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '800'
};

const mainStyle = {
    padding: '32px 20px 56px'
};

const mobileMainStyle = {
    padding: '20px 14px 32px'
};

const contentStyle = {
    width: '100%',
    maxWidth: '960px',
    margin: '0 auto'
};

const mobileContentStyle = {
    maxWidth: '100%'
};

const backButtonStyle = {
    marginBottom: '18px',
    padding: 0,
    backgroundColor: 'transparent',
    border: 'none',
    color: '#99A2AF',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600'
};

const mobileBackButtonStyle = {
    fontSize: '12px'
};

export default ContractAnalyzer;
