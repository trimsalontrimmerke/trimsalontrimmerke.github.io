import loadable from '@loadable/component';
import { Spin } from 'antd';

const LazyCarousel = loadable(() => import('./Carousel'), {
  fallback: <div style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spin /></div>
});

export default LazyCarousel;