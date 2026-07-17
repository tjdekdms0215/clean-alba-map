import React, {
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import { analyzeContract } from '../../api/ai';

const ALLOWED_EXTENSIONS = [
    'jpg',
    'jpeg',
    'png',
    'pdf'
];

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;

const getExtension = (name = '') =>
    name.split('.').pop()?.toLowerCase() || '';

const isAllowedFile = (file) =>
    ALLOWED_EXTENSIONS.includes(
        getExtension(file.name)
    );

const statusMap = {
    success: {
        label: '양호',
        color: '#1FA84F',
        backgroundColor: '#EFFAF2'
    },
    warning: {
        label: '확인 필요',
        color: '#D07A09',
        backgroundColor: '#FFF6E7'
    },
    danger: {
        label: '주의',
        color: '#E14A42',
        backgroundColor: '#FFF2F0'
    }
};

const ContractAnalyzerPanel = () => {
    const inputRef = useRef(null);
    const previewUrlRef = useRef(null);

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(
        () => () => {
            if (previewUrlRef.current) {
                URL.revokeObjectURL(
                    previewUrlRef.current
                );
            }
        },
        []
    );

    const isImage = useMemo(
        () =>
            selectedFile
                ? selectedFile.type.startsWith('image/')
                : false,
        [selectedFile]
    );

    const handleSelectFile = (file) => {
        if (!file) {
            return;
        }

        if (!isAllowedFile(file)) {
            setMessage(
                'JPG, JPEG, PNG, PDF 파일만 분석할 수 있습니다.'
            );
            return;
        }

        if (file.size > MAX_FILE_SIZE_BYTES) {
            setMessage(
                '계약서 파일은 8MB 이하만 업로드할 수 있습니다.'
            );
            return;
        }

        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
        }

        const nextPreview = file.type.startsWith('image/')
            ? URL.createObjectURL(file)
            : '';

        previewUrlRef.current = nextPreview || null;
        setSelectedFile(file);
        setPreviewUrl(nextPreview);
        setResult(null);
        setMessage('');
    };

    const handleChange = (event) => {
        handleSelectFile(event.target.files?.[0]);
        event.target.value = '';
    };

    const handleAnalyze = async () => {
        if (!selectedFile) {
            setMessage(
                '먼저 분석할 계약서 이미지를 업로드해 주세요.'
            );
            return;
        }

        setIsAnalyzing(true);
        setMessage('');

        try {
            const data = await analyzeContract(
                selectedFile
            );

            setResult(data);

            if (data.source === 'fallback') {
                setMessage(
                    'AI 응답이 지연되어 기본 체크리스트를 먼저 보여드리고 있습니다.'
                );
            }
        } catch (error) {
            console.error(
                '계약서 분석에 실패했습니다.',
                error
            );
            setMessage(
                '계약서 분석 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.'
            );
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <section style={panelStyle}>
            <div style={headerStyle}>
                <div>
                    <h1 style={titleStyle}>
                        AI 계약서 분석
                    </h1>
                    <p style={subtitleStyle}>
                        근로계약서 이미지나 PDF를 올리면
                        핵심 조항을 빠르게 점검해드립니다.
                    </p>
                </div>

                <span style={badgeStyle}>
                    contract-analyzer
                </span>
            </div>

            <div
                style={uploadBoxStyle}
                onClick={() => inputRef.current?.click()}
                onDragOver={(event) =>
                    event.preventDefault()
                }
                onDrop={(event) => {
                    event.preventDefault();
                    handleSelectFile(
                        event.dataTransfer.files?.[0]
                    );
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                    if (
                        event.key === 'Enter' ||
                        event.key === ' '
                    ) {
                        inputRef.current?.click();
                    }
                }}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleChange}
                    style={{ display: 'none' }}
                />

                <div style={uploadIconStyle}>⌁</div>
                <strong style={uploadTitleStyle}>
                    계약서 이미지를 드래그하거나 클릭해서 업로드
                </strong>
                <span style={uploadHelpStyle}>
                    JPG · JPEG · PNG · PDF / 최대 8MB
                </span>
            </div>

            {selectedFile && (
                <div style={filePreviewCardStyle}>
                    <div style={previewMediaStyle}>
                        {isImage ? (
                            <img
                                src={previewUrl}
                                alt={selectedFile.name}
                                style={previewImageStyle}
                            />
                        ) : (
                            <div style={pdfPreviewStyle}>
                                PDF
                            </div>
                        )}
                    </div>

                    <div style={fileMetaStyle}>
                        <strong style={fileNameStyle}>
                            {selectedFile.name}
                        </strong>
                        <span style={fileDescStyle}>
                            업로드 완료 후 핵심 조항과
                            주의 포인트를 정리합니다.
                        </span>
                    </div>

                    <button
                        type="button"
                        style={analyzeButtonStyle}
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                    >
                        {isAnalyzing
                            ? '분석 중...'
                            : 'AI로 분석하기'}
                    </button>
                </div>
            )}

            {message && (
                <p style={messageStyle}>{message}</p>
            )}

            {result && (
                <div style={resultSectionStyle}>
                    <div style={summaryCardStyle}>
                        <strong style={summaryTitleStyle}>
                            분석 요약
                        </strong>
                        <p style={summaryTextStyle}>
                            {result.summary}
                        </p>
                    </div>

                    <div style={checkGridStyle}>
                        {result.checks.map((check) => {
                            const statusInfo =
                                statusMap[
                                    check.status
                                ] ||
                                statusMap.warning;

                            return (
                                <article
                                    key={`${check.title}-${check.detail}`}
                                    style={checkCardStyle}
                                >
                                    <div
                                        style={
                                            checkHeaderStyle
                                        }
                                    >
                                        <strong
                                            style={
                                                checkTitleStyle
                                            }
                                        >
                                            {check.title}
                                        </strong>

                                        <span
                                            style={{
                                                ...statusBadgeStyle,
                                                color:
                                                    statusInfo.color,
                                                backgroundColor:
                                                    statusInfo.backgroundColor
                                            }}
                                        >
                                            {
                                                statusInfo.label
                                            }
                                        </span>
                                    </div>

                                    <p
                                        style={
                                            checkTextStyle
                                        }
                                    >
                                        {check.detail}
                                    </p>
                                </article>
                            );
                        })}
                    </div>

                    {(result.alerts?.length ||
                        result.nextSteps?.length) && (
                        <div style={sideBySideStyle}>
                            <div style={noteCardStyle}>
                                <strong
                                    style={
                                        noteTitleStyle
                                    }
                                >
                                    주의 포인트
                                </strong>
                                <ul
                                    style={
                                        noteListStyle
                                    }
                                >
                                    {result.alerts?.map(
                                        (alert) => (
                                            <li
                                                key={
                                                    alert
                                                }
                                            >
                                                {alert}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>

                            <div style={noteCardStyle}>
                                <strong
                                    style={
                                        noteTitleStyle
                                    }
                                >
                                    다음 확인 단계
                                </strong>
                                <ul
                                    style={
                                        noteListStyle
                                    }
                                >
                                    {result.nextSteps?.map(
                                        (step) => (
                                            <li
                                                key={
                                                    step
                                                }
                                            >
                                                {step}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

const panelStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px'
};

const headerStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '14px',
    flexWrap: 'wrap'
};

const titleStyle = {
    margin: 0,
    color: '#18202D',
    fontSize: '28px',
    fontWeight: '900',
    letterSpacing: '-0.5px'
};

const subtitleStyle = {
    margin: '8px 0 0',
    color: '#7C8595',
    fontSize: '14px',
    lineHeight: '1.6'
};

const badgeStyle = {
    padding: '6px 10px',
    borderRadius: '999px',
    backgroundColor: '#EDF2FF',
    color: '#4668EC',
    fontSize: '11px',
    fontWeight: '800'
};

const uploadBoxStyle = {
    minHeight: '180px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    border: '1px dashed #D7DEE8',
    borderRadius: '20px',
    background:
        'linear-gradient(180deg, #FAFBFD 0%, #F3F6FB 100%)',
    textAlign: 'center',
    cursor: 'pointer'
};

const uploadIconStyle = {
    color: '#6F7A8B',
    fontSize: '24px',
    lineHeight: 1
};

const uploadTitleStyle = {
    color: '#263040',
    fontSize: '15px',
    fontWeight: '800'
};

const uploadHelpStyle = {
    color: '#97A0AD',
    fontSize: '12px',
    fontWeight: '500'
};

const filePreviewCardStyle = {
    padding: '16px',
    display: 'grid',
    gridTemplateColumns: '96px minmax(0, 1fr) auto',
    gap: '14px',
    alignItems: 'center',
    border: '1px solid #E4E9F1',
    borderRadius: '18px',
    backgroundColor: '#FFFFFF'
};

const previewMediaStyle = {
    width: '96px',
    height: '96px',
    overflow: 'hidden',
    borderRadius: '14px',
    backgroundColor: '#F2F5F9'
};

const previewImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
};

const pdfPreviewStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FF6B39',
    fontSize: '20px',
    fontWeight: '900',
    backgroundColor: '#FFF3EC'
};

const fileMetaStyle = {
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
};

const fileNameStyle = {
    color: '#1E2634',
    fontSize: '14px',
    fontWeight: '800',
    wordBreak: 'break-all'
};

const fileDescStyle = {
    color: '#8E97A6',
    fontSize: '12px',
    lineHeight: '1.6'
};

const analyzeButtonStyle = {
    minWidth: '124px',
    height: '40px',
    padding: '0 16px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: '#4668EC',
    color: '#FFFFFF',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '800'
};

const messageStyle = {
    margin: 0,
    color: '#7B8595',
    fontSize: '12px',
    lineHeight: '1.6'
};

const resultSectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
};

const summaryCardStyle = {
    padding: '18px',
    border: '1px solid #E4E9F1',
    borderRadius: '18px',
    backgroundColor: '#FFFFFF'
};

const summaryTitleStyle = {
    color: '#1E2634',
    fontSize: '14px',
    fontWeight: '900'
};

const summaryTextStyle = {
    margin: '10px 0 0',
    color: '#5C6574',
    fontSize: '14px',
    lineHeight: '1.8'
};

const checkGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '12px'
};

const checkCardStyle = {
    padding: '16px',
    border: '1px solid #E4E9F1',
    borderRadius: '18px',
    backgroundColor: '#FFFFFF'
};

const checkHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    marginBottom: '10px'
};

const checkTitleStyle = {
    color: '#1E2634',
    fontSize: '14px',
    fontWeight: '800'
};

const statusBadgeStyle = {
    padding: '5px 9px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: '800',
    whiteSpace: 'nowrap'
};

const checkTextStyle = {
    margin: 0,
    color: '#647082',
    fontSize: '13px',
    lineHeight: '1.7'
};

const sideBySideStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '12px'
};

const noteCardStyle = {
    padding: '16px',
    border: '1px solid #E4E9F1',
    borderRadius: '18px',
    backgroundColor: '#FFFFFF'
};

const noteTitleStyle = {
    color: '#1E2634',
    fontSize: '14px',
    fontWeight: '900'
};

const noteListStyle = {
    margin: '12px 0 0',
    paddingLeft: '18px',
    color: '#647082',
    fontSize: '13px',
    lineHeight: '1.8'
};

export default ContractAnalyzerPanel;
