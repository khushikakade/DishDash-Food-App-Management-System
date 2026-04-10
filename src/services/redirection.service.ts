import Redirection from '../models/redirection.model';
import Product from '../models/product.model';
import PriceComparison from '../models/priceComparison.model';

type RedirectionPayload = {
  redirection_url: string;
  productId: number;
  priceComparisonId: number;
};

export const createRedirection = async (
  redirectionData: RedirectionPayload
): Promise<Redirection> => {
  return Redirection.create(redirectionData);
};

export const getRedirections = async (): Promise<Redirection[]> => {
  return Redirection.findAll({
    include: [Product, PriceComparison],
  });
};

export const getRedirectionById = async (
  id: number
): Promise<Redirection | null> => {
  return Redirection.findByPk(id, {
    include: [Product, PriceComparison],
  });
};

export const updateRedirection = async (
  id: number,
  redirectionData: Partial<RedirectionPayload>
): Promise<Redirection | null> => {
  const [affectedCount] = await Redirection.update(redirectionData, {
    where: { id },
  });

  if (affectedCount > 0) {
    return Redirection.findByPk(id, {
      include: [Product, PriceComparison],
    });
  }

  return null;
};

export const deleteRedirection = async (id: number): Promise<number> => {
  return Redirection.destroy({
    where: { id },
  });
};
