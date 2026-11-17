import React from "react";
import { Composition } from "remotion";
import { CIAwardsVideo, TOTAL } from "./Video";
import { CIAwardsTeste, TESTE_TOTAL } from "./teste/Teste";
import { CIAwardsMix, MIX_TOTAL } from "./mix/Mix";
import { CIAwardsV6, V6_TOTAL } from "./v6/V6";
import { CIAwardsV8, V8_TOTAL } from "./v8/V8";
import { FKVideo, FK_TOTAL } from "./fk/FK";
import { FK2_TOTAL, FKVideo2, FKVideo2SemVoz } from "./fk/FK2";
import { PROMO_TOTAL, PromoVideo } from "./promo/Promo";
import { PROMO3_TOTAL, PromoVideo3 } from "./promo/Promo3";
import { PROMO4_TOTAL, PromoVideo4 } from "./promo/Promo4";
import { Fx } from "./teste-fx/Fx";
import { CliqueMotionVideo, CM_TOTAL } from "./cm/CliqueMotion";
import { CliqueMotionVideoF, CM_TOTAL_F } from "./cm/CliqueMotionF";
import { EduardoVideo, EDU_TOTAL } from "./eduardo/Eduardo";
import { EduardoVideo2, EDU2_TOTAL } from "./eduardo/Eduardo2";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="CIAwards" component={CIAwardsVideo} durationInFrames={TOTAL} fps={30} width={1920} height={1080} />
      <Composition id="CIAwardsTeste" component={CIAwardsTeste} durationInFrames={TESTE_TOTAL} fps={30} width={1920} height={1080} />
      <Composition id="CIAwardsMix" component={CIAwardsMix} durationInFrames={MIX_TOTAL} fps={30} width={1920} height={1080} />
      <Composition id="CIAwardsV8" component={CIAwardsV8} durationInFrames={V8_TOTAL} fps={30} width={1920} height={1080} />
      <Composition id="CIAwardsV8Vertical" component={CIAwardsV8} durationInFrames={V8_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="CIAwardsV6" component={CIAwardsV6} durationInFrames={V6_TOTAL} fps={30} width={1920} height={1080} />
      <Composition id="FKWealth" component={FKVideo} durationInFrames={FK_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="FKWealth2" component={FKVideo2} durationInFrames={FK2_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="FKWealth2SemVoz" component={FKVideo2SemVoz} durationInFrames={FK2_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Promo" component={PromoVideo} durationInFrames={PROMO_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Promo3" component={PromoVideo3} durationInFrames={PROMO3_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Promo4" component={PromoVideo4} durationInFrames={PROMO4_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="FxTeste" component={Fx} durationInFrames={30} fps={30} width={1080} height={1080} />
      <Composition id="CliqueMotion" component={CliqueMotionVideo} durationInFrames={CM_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="CliqueMotionFeminina" component={CliqueMotionVideoF} durationInFrames={CM_TOTAL_F} fps={30} width={1080} height={1920} />
      <Composition id="EduardoVeiculos" component={EduardoVideo} durationInFrames={EDU_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="EduardoVeiculos2" component={EduardoVideo2} durationInFrames={EDU2_TOTAL} fps={30} width={1080} height={1920} />
    </>
  );
};
