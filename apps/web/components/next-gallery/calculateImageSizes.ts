export type ExtraArgsShape = { extraArgs?: any };

export type Image<ExtraArgs extends ExtraArgsShape = {}> = {
  src: string;
  aspect_ratio: number;
  alt?: string;
} & ExtraArgs;

export type LastRowBehaviorMatchPrevious = {
  lastRowBehavior?: "match-previous";
  shrinkLimit?: number; // default: 0.5, 1 disables shrinking
  growLimit?: number; // default: 1.5, 1 disables growing
  preferGrowing?: number; // default: 2
};

export type LastRowBehaviorPreserve = {
  lastRowBehavior: "preserve";
};

export type LastRowBehaviorFill = {
  lastRowBehavior: "fill";
  threshold?: number; // default: 0, above what percentage of last row being filled, it should stretch to the full width of the screen
};

export type GalleryCalculationProps<ExtraArgs extends ExtraArgsShape = {}> = {
  ratios: number[];
  images: Image<ExtraArgs>[];
} & (
  | LastRowBehaviorMatchPrevious
  | LastRowBehaviorPreserve
  | LastRowBehaviorFill
);

function round(number: number) {
  return Math.floor(number * 10000) / 100;
}

export const calculateImageSizes = <ExtraArgs extends ExtraArgsShape = {}>(
  arg: GalleryCalculationProps<ExtraArgs>
) => {
  const sizes: number[][] = Array.from({ length: arg.images.length }, () => []);
  const wl: number[] = [];
  for (const desired_ratio of arg.ratios) {
    let current_ratio = 0;
    let result_width_percent: number[] = [];
    let second_last_row_start = 0;
    for (let i = 0; i < arg.images.length; i++) {
      if (current_ratio + arg.images[i].aspect_ratio <= desired_ratio) {
        current_ratio += arg.images[i].aspect_ratio;
      } else {
        second_last_row_start = result_width_percent.length;
        const start_index = result_width_percent.length;
        for (let j = start_index; j < i; j++) {
          const rounded = round(arg.images[j].aspect_ratio / current_ratio);
          result_width_percent.push(rounded);
        }
        current_ratio = arg.images[i].aspect_ratio;
      }
    }
    const second_last_row = result_width_percent.slice(second_last_row_start);
    for (let i = 1; i < second_last_row.length; i++)
      second_last_row[i] += second_last_row[i - 1];
    second_last_row.push(100);
    let second_last_row_i = 0;

    const last_row_start = result_width_percent.length;
    let last_row_ratio = 0;
    const last_row_multipliers: number[] = [];
    for (let i = result_width_percent.length; i < arg.images.length; i++) {
      // last row initially match the desired_ratio and will be rescaled
      const r = round(arg.images[i].aspect_ratio / desired_ratio);
      result_width_percent.push(r);
      last_row_ratio += r;
      while (second_last_row[second_last_row_i] < last_row_ratio)
        second_last_row_i++;
      last_row_multipliers.push(
        second_last_row[second_last_row_i] / last_row_ratio
      );
      if (second_last_row_i > 0) {
        last_row_multipliers.push(
          second_last_row[second_last_row_i - 1] / last_row_ratio
        );
      }
    }

    if (arg.lastRowBehavior == "fill") {
      const multiplier = desired_ratio / current_ratio;
      if (1 >= multiplier * (arg.threshold ?? 0)) {
        for (let i = last_row_start; i < result_width_percent.length; i++) {
          result_width_percent[i] *= multiplier;
        }
      }
    } else if (
      arg.lastRowBehavior == "match-previous" ||
      arg.lastRowBehavior === undefined
    ) {
      // calculate the best multiplier for the last row
      const growLimit = arg.growLimit ?? 1.5;
      const shrinkLimit = arg.shrinkLimit ?? 0.5;
      const preferGrowing = arg.preferGrowing ?? 2;

      // in the worst case we will just fill the whole width with the last row
      last_row_multipliers.push(100 / last_row_ratio);

      let best_multiplier = 1;
      let best_fitness = Infinity;
      for (const m of last_row_multipliers) {
        if (m >= 1) {
          const m_fitness = m;
          if (m > growLimit) continue;
          if (Math.abs(m_fitness) < Math.abs(best_fitness)) {
            best_multiplier = m;
            best_fitness = m_fitness;
          }
        } else {
          const m_fitness = preferGrowing / m;
          if (m < shrinkLimit) continue;
          if (Math.abs(m_fitness) < Math.abs(best_fitness)) {
            best_multiplier = m;
            best_fitness = m_fitness;
          }
        }
      }

      for (let i = last_row_start; i < result_width_percent.length; i++) {
        result_width_percent[i] *= best_multiplier;
      }
    }

    let width_left = 100;
    for (let i = last_row_start; i < result_width_percent.length; i++) {
      width_left -= result_width_percent[i];
    }

    for (const i in result_width_percent) {
      sizes[i].push(result_width_percent[i]);
    }
    wl.push(width_left);
  }
  return [sizes, wl] as const;
};
