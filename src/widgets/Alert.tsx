import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import Warning from '@mui/icons-material/Warning';
import Alert from '@mui/joy/Alert';
import AspectRatio from '@mui/joy/AspectRatio';
import IconButton from '@mui/joy/IconButton';
import LinearProgress from '@mui/joy/LinearProgress';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import React, { useEffect } from 'react';

interface AlertComponentProps {
    message: string;
    type: 'success' | 'danger';
    position: 'bottom-right' | 'center';
    showProgress: boolean;
    isOpen: boolean;
    onClose: () => void;
}

const AlertComponent: React.FC<AlertComponentProps> = ({
    message,
    type,
    position,
    showProgress,
    isOpen,
    onClose,
}) => {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
                if (type === 'success') {
                    window.location.reload();
                }
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, type, onClose]);

    if (!isOpen) return null;

    const isSuccess = type === 'success';

    const alertStyles = {
        position: 'fixed' as 'fixed',
        zIndex: 1000,
        ...(position === 'bottom-right' && {
            bottom: '3rem',
            right: '3rem',
        }),
        ...(position === 'center' && {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
        }),
    };

    return (
        <Stack spacing={2} sx={{ maxWidth: 400, ...alertStyles }}>
            <Alert
                size="lg"
                color={isSuccess ? 'success' : 'danger'}
                variant="solid"
                invertedColors
                startDecorator={
                    <AspectRatio
                        variant="solid"
                        ratio="1"
                        sx={{
                            minWidth: 40,
                            borderRadius: '50%',
                            boxShadow: '0 2px 12px 0 rgb(0 0 0/0.2)',
                        }}
                    >
                        <div>
                            {isSuccess ? <Check fontSize="large" /> : <Warning fontSize="large" />}
                        </div>
                    </AspectRatio>
                }
                endDecorator={
                    <IconButton
                        variant="plain"
                        onClick={onClose}
                        sx={{
                            '--IconButton-size': '32px',
                            transform: 'translate(0.5rem, -0.5rem)',
                        }}
                    >
                        <Close />
                    </IconButton>
                }
                sx={{ alignItems: 'flex-start', overflow: 'hidden' }}
            >
                <div>
                    <Typography level="title-lg">{isSuccess ? 'Success' : 'Error'}</Typography>
                    <Typography level="body-sm">{message}</Typography>
                </div>
                {showProgress && (
                    <LinearProgress
                        variant="solid"
                        color={isSuccess ? 'success' : 'danger'}
                        value={40}
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            borderRadius: 0,
                        }}
                    />
                )}
            </Alert>
        </Stack>
    );
};

export default AlertComponent;
