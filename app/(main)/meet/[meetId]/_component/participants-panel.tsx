type ParticipantsPanelType = {
  hoverData: string[];
  participantsNum: number;
  location: { x: number; y: number };
};

export default function ParticipantsPanel({
  hoverData,
  participantsNum,
  location,
}: ParticipantsPanelType) {
  return (
    <div
      className={`bg-cardColor w-1/4 rounded-lg p-6 text-[16px] flex flex-col gap-4 ${hoverData.length == 0 ? 'invisible' : ''} absolute`}
      style={{ left: location.x, top: location.y }}
    >
      <p>
        응답자: {hoverData.length}/{participantsNum}
      </p>
      {hoverData.map((data, i) => (
        <p key={i}>{data}</p>
      ))}
    </div>
  );
}
