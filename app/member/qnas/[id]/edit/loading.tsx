export default function Loading() {
  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">질문을 불러오는 중...</p>
        </div>
      </div>
    </div>
  );
}
