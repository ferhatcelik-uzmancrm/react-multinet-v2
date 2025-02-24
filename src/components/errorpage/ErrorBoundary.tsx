import React, { Component, ErrorInfo } from 'react';
 
interface ErrorBoundaryProps {
  children: React.ReactNode;
}
 
interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}
 
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: ''
    };
  }
 
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // State güncellenerek render işlemi yapılacak
    return { hasError: true, errorMessage: error.message };
  }
 
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Burada hatayı izleme hizmetlerine gönderebiliriz
    console.error('Hata:', error, errorInfo);
  }
 
  render() {
    if (this.state.hasError) {
      // Kullanıcıya hata mesajı gösterilebilir
      return <h1>Bir hata oluştu: {this.state.errorMessage}</h1>;
    }
 
    return this.props.children;
  }
}
 
export default ErrorBoundary;
 