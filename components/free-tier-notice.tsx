import { Info } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";

export function FreeTierNotice() {
  return (
    <Alert className="border border-blue-200/50 bg-blue-50/60 backdrop-blur-sm">
      <Info className="text-blue-500" />
      <AlertDescription className="text-blue-900/80">
        この分析には Gemini API の無料枠を使用しています。無料枠でご利用いただいた内容は、Google
        のサービス改善のために利用される場合があります。
      </AlertDescription>
    </Alert>
  );
}
