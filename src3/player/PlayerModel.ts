import Model from "../../src3/model/Model";

type SlapstukPlayerState = {
  videoId?: string;
};

class PlayerModel extends Model<SlapstukPlayerState> {}

export default PlayerModel;
