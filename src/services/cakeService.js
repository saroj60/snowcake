const STORAGE_KEY = 'snowcakes_inventory';

const defaultCakes = [
  {
    id: '1',
    name: 'Velvet Truffle Cake',
    price: 45,
    description: 'Valrhona dark chocolate & gold leaf',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3zYapD8iG4SHmm3CCJ_RkarZV99T01dTTIUgxNildtC2j6cx4-vdGKrSpBL53vgPprZs3RP4xjUtYj1EBUb03psB7j6fClPD20HLTNZ9IzLoimfe5B8g-URVue6TfmAS9lsnCKFUoIPwrn_PVsaFdVWWLLYeDuCgDQnrGu4a0SyhOQEqH8kdR8vwj8cc5PcIIjfr7ydchDAX5Q1_BJHuUIv4C2rssxjNlSaJhNijaaDIiqefcYXcv0HDbSKsOy4YLzplx85YD5Zo4'
  },
  {
    id: '2',
    name: 'Heritage Croissant',
    price: 8,
    description: '72-hour fermented Normandy butter',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABty6TUkpl4cp0NrGKOiL16xxdhVKIaeSXApVvCXxzWgbDv1bWQHrJmYcpzoELYzuFdJnc3FjfkU50Njvzj81DHXxwVXMWqO0fp2GLDO6pbnpRN-6ObwJ_c33UI29CQbnC_xxkUwv-h2B6Na2UT1zVMktkKkJsOJXJLvZNXLS3Kih7J5YkjlZrBa-Qy0LU3sYaZohjo1FsATmJZoVxnUSDjngAmBqgjVvTmDOx0XenZCK3sd6523A2BHHYEUrZ_RxsuR4IQvz91Sju'
  },
  {
    id: '3',
    name: 'Parisian Macarons',
    price: 24,
    description: 'Selection of six seasonal flavors',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDULzUn82smvSETVUn7xdIPBSxMbE-Nc793m0m5nhayCnHyrmJ93FOvLFuD5N8tL3hUFFuPgKWWgJ7Syczl4o3L4ng27jxS1BgwEoewB3c5hdP9tMNJvgUNZIh2pqSX_8wLQbPIG-ASduFx5ovmMbI21I746EicDw3VSoWcAD1TPXfrMyD4FT--xEKkNi46jMQx2LkS4XtyvA4ih6Lm8OpjHOY7BIAOjIkzppLP4QwrpWQRRbwTNJ4xq1X3miKFEhPB82N6yhepcR58'
  }
];

export const getCakes = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCakes));
    return defaultCakes;
  }
  return JSON.parse(data);
};

export const addCake = (cake) => {
  const cakes = getCakes();
  const newCake = {
    ...cake,
    id: Date.now().toString()
  };
  cakes.push(newCake);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cakes));
  return newCake;
};

export const deleteCake = (id) => {
  let cakes = getCakes();
  cakes = cakes.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cakes));
};
