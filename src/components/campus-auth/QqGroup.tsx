import { useState } from "react";
import { SITE } from "@/data/site";
import { cn } from "@/lib/utils";

// 官方群分享短链：浏览器打开后由官方页唤起 QQ 加群，桌面 NT QQ / 手机 QQ 均支持。
// 旧版 mqqapi://card/show_pslcard 深链在新版桌面 QQ 会弹"暂不支持该内容"。
// 密钥失效换群时需在 QQ 群设置 → 分享群 重新生成。
export const QQ_GROUP_URL = "https://qm.qq.com/q/rzhUZqRvzM";

function useCopyQq() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    const done = () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(SITE.qqGroup).then(done).catch(done);
    } else {
      done();
    }
  };
  return { copied, copy };
}

function QqLabel({ copied, subClassName }: { copied: boolean; subClassName?: string }) {
  return (
    <span>
      <span className="block text-sm font-semibold leading-tight">QQ 官方群</span>
      <span className={cn("block text-xs leading-tight text-muted-foreground", subClassName)}>
        {copied ? "群号已复制" : `群号：${SITE.qqGroup}`}
      </span>
    </span>
  );
}

type AnchorProps = {
  className?: string;
  children: (copied: boolean) => React.ReactNode;
};

/** 直跳 QQ 加群，顺手复制群号兜底（未安装 QQ 时用户可搜号加入） */
function QqAnchor({ className, children }: AnchorProps) {
  const { copied, copy } = useCopyQq();
  return (
    <a
      href={QQ_GROUP_URL}
      target="_blank"
      rel="noopener noreferrer"
      title="QQ 官方群"
      aria-label={`QQ 官方群，群号 ${SITE.qqGroup}，点击加入`}
      onClick={copy}
      className={className}
    >
      {children(copied)}
    </a>
  );
}

/** 页脚用的紧凑 pill */
export function QqGroupPill() {
  return (
    <QqAnchor className="inline-flex items-center gap-2.5 rounded-lg border bg-background px-3 py-1.5 hover:text-foreground">
      {(copied) => (
        <>
          <img src="/icons/tencentqq.svg" alt="" aria-hidden="true" loading="lazy" decoding="async" className="h-6 w-6 dark:invert" />
          <QqLabel copied={copied} />
        </>
      )}
    </QqAnchor>
  );
}

/** 文档右侧栏用的卡片 */
export function QqGroupCard() {
  return (
    <QqAnchor className="mt-6 flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm transition-colors hover:border-primary/40">
      {(copied) => (
        <>
          <img src="/icons/tencentqq.svg" alt="" aria-hidden="true" loading="lazy" decoding="async" className="h-9 w-9 shrink-0 dark:invert" />
          <QqLabel copied={copied} />
        </>
      )}
    </QqAnchor>
  );
}
