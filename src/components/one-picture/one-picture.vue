<template>
  <div class="panel-container">
    <!-- <div class="panel-title">指挥调度一张图</div> -->
    <div class="panel-content">
      <div id="mapContainer" class="map"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "one-picture",
  data() {
    return {};
  },
  mounted() {
    // 初始化地图容器
    const map = L.map("mapContainer", {
      // center: [30.430076485018596, 114.41137433052064], // 公司
      center: [30.44326443351204, 114.43944445432024], // 佛祖岭
      zoom: 18
    });
    const bussLayer = L.supermap
      .tiledMapLayer(
        "http://172.29.1.151:8090/iserver/services/map-OneMap2/rest/maps/一张图",
        {
          zIndex: 2,
          transparent: true,
          maxZoom: 24,
          minZoom: 13
        }
      )
      .addTo(map);
      console.log(bussLayer);
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/common.scss";
.map {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  background: rgba(0, 0, 0, 0.1);
  cursor: move;
}
</style>