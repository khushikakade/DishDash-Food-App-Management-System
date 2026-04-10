import PriceComparison from '../models/priceComparison.model';
import User from '../models/user.model';
import Platform from '../models/platform.model';

type PriceComparisonPayload = {
  compare_price: number;
  userId: number;
  platformId: number;
};

export const createPriceComparison = async (
  priceComparisonData: PriceComparisonPayload
): Promise<PriceComparison> => {
  return PriceComparison.create(priceComparisonData);
};

export const getPriceComparisons = async (): Promise<PriceComparison[]> => {
  return PriceComparison.findAll({
    include: [User, Platform],
  });
};

export const getPriceComparisonById = async (
  id: number
): Promise<PriceComparison | null> => {
  return PriceComparison.findByPk(id, {
    include: [User, Platform],
  });
};

export const updatePriceComparison = async (
  id: number,
  priceComparisonData: Partial<PriceComparisonPayload>
): Promise<PriceComparison | null> => {
  const [affectedCount] = await PriceComparison.update(priceComparisonData, {
    where: { id },
  });

  if (affectedCount > 0) {
    return PriceComparison.findByPk(id, {
      include: [User, Platform],
    });
  }

  return null;
};

export const deletePriceComparison = async (id: number): Promise<number> => {
  return PriceComparison.destroy({
    where: { id },
  });
};
