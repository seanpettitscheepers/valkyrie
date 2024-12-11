import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ReportExportButtonProps {
  reportRef: React.RefObject<HTMLDivElement>;
}

export function ReportExportButton({ reportRef }: ReportExportButtonProps) {
  const { toast } = useToast();

  const exportToPDF = async () => {
    if (!reportRef.current) return;

    try {
      toast({
        title: "Generating PDF...",
        description: "Please wait while we prepare your report.",
      });

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? "portrait" : "landscape",
        unit: "mm",
      });

      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        imgWidth,
        imgHeight
      );

      pdf.save("campaign-report.pdf");

      toast({
        title: "PDF Generated",
        description: "Your report has been downloaded successfully.",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={exportToPDF} className="gap-2">
      <FileDown className="h-4 w-4" />
      Export PDF
    </Button>
  );
}