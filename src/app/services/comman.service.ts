import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { PDFDocument } from 'pdf-lib';

@Injectable({
  providedIn: 'root'
})
export class CommanService {

  constructor() { }

  toster(type: any = 'success', messge: any) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast: any) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: type,
      title: messge
    });
  }

  confirm(message: string, confirmButtonText: string = 'Yes', cancelButtonText: string = 'No') {
    return Swal.fire({
      title: 'Are you sure?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText
    });
  }

  downloadFile(fileUrl: string) {
    if (fileUrl) {
      const filename = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
      fetch(fileUrl)
        .then(response => response.blob())
        .then(blob => {
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = filename;

          document.body.appendChild(link);
          link.click();

          document.body.removeChild(link);
          window.URL.revokeObjectURL(link.href);
        })
        .catch(error => console.error('Error downloading the image:', error));
    } else {
      this.toster('warning', "Part Catalogue URL not found")
    }

  }

  hideShowPassword(inputId: string, iconId: string): void {
    const input = document.getElementById(inputId) as HTMLInputElement;
    const icon = document.getElementById(iconId) as HTMLElement;

    if (input.type === 'password') {
      input.type = 'text';
      icon.className = 'bi bi-eye-slash';
    } else {
      input.type = 'password';
      icon.className = 'bi bi-eye';
    }
  }

  async mergePdfs(pdf1: ArrayBuffer, pdf2: ArrayBuffer): Promise<Blob> {
    const pdfDoc1 = await PDFDocument.load(pdf1);
    const pdfDoc2 = await PDFDocument.load(pdf2);

    const mergedPdf = await PDFDocument.create();

    const copiedPages1 = await mergedPdf.copyPages(pdfDoc1, pdfDoc1.getPageIndices());
    copiedPages1.forEach((page) => mergedPdf.addPage(page));

    const copiedPages2 = await mergedPdf.copyPages(pdfDoc2, pdfDoc2.getPageIndices());
    copiedPages2.forEach((page) => mergedPdf.addPage(page));

    const pdfBytes = await mergedPdf.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  }
}
