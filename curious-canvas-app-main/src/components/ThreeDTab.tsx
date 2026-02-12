import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Sphere, Cylinder, Box, Cone, Torus } from "@react-three/drei";
import { ThreeDModel, ThreeDObject } from "@/types/stem";
import { motion } from "framer-motion";

function Object3D({ obj }: { obj: ThreeDObject }) {
  const pos = obj.position;
  const rot = obj.rotation ?? [0, 0, 0];
  const scl = obj.scale ?? [1, 1, 1];

  const meshProps = {
    position: pos as [number, number, number],
    rotation: rot as [number, number, number],
    scale: scl as [number, number, number],
  };

  const material = <meshStandardMaterial color={obj.color} transparent opacity={0.85} />;

  switch (obj.shape) {
    case "sphere":
      return (
        <group {...meshProps}>
          <Sphere args={[0.5, 32, 32]}>{material}</Sphere>
          {obj.label && (
            <Text position={[0, 0.8, 0]} fontSize={0.25} color={obj.color}>
              {obj.label}
            </Text>
          )}
        </group>
      );
    case "cylinder":
      return (
        <group {...meshProps}>
          <Cylinder args={[0.3, 0.3, 1, 32]}>{material}</Cylinder>
          {obj.label && (
            <Text position={[0, 1, 0]} fontSize={0.25} color={obj.color}>
              {obj.label}
            </Text>
          )}
        </group>
      );
    case "box":
      return (
        <group {...meshProps}>
          <Box args={[1, 1, 1]}>{material}</Box>
          {obj.label && (
            <Text position={[0, 1, 0]} fontSize={0.25} color={obj.color}>
              {obj.label}
            </Text>
          )}
        </group>
      );
    case "cone":
      return (
        <group {...meshProps}>
          <Cone args={[0.5, 1, 32]}>{material}</Cone>
          {obj.label && (
            <Text position={[0, 1, 0]} fontSize={0.25} color={obj.color}>
              {obj.label}
            </Text>
          )}
        </group>
      );
    case "torus":
      return (
        <group {...meshProps}>
          <Torus args={[0.5, 0.15, 16, 48]}>{material}</Torus>
          {obj.label && (
            <Text position={[0, 1, 0]} fontSize={0.25} color={obj.color}>
              {obj.label}
            </Text>
          )}
        </group>
      );
    case "arrow": {
      return (
        <group {...meshProps}>
          <Cylinder args={[0.05, 0.05, 1, 8]} position={[0, 0, 0]}>
            {material}
          </Cylinder>
          <Cone args={[0.15, 0.3, 8]} position={[0, 0.65, 0]}>
            {material}
          </Cone>
          {obj.label && (
            <Text position={[0.5, 0, 0]} fontSize={0.2} color={obj.color}>
              {obj.label}
            </Text>
          )}
        </group>
      );
    }
    case "plane":
      return (
        <group {...meshProps}>
          <mesh>
            <planeGeometry args={[2, 2]} />
            <meshStandardMaterial color={obj.color} transparent opacity={0.3} side={2} />
          </mesh>
          {obj.label && (
            <Text position={[0, 1.2, 0]} fontSize={0.25} color={obj.color}>
              {obj.label}
            </Text>
          )}
        </group>
      );
    default:
      return (
        <group {...meshProps}>
          <Sphere args={[0.3, 16, 16]}>{material}</Sphere>
          {obj.label && (
            <Text position={[0, 0.6, 0]} fontSize={0.2} color={obj.color}>
              {obj.label}
            </Text>
          )}
        </group>
      );
  }
}

interface ThreeDTabProps {
  model: ThreeDModel;
  fieldColor: string;
}

export function ThreeDTab({ model, fieldColor }: ThreeDTabProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
      <h3 className="font-semibold text-foreground">{model.description}</h3>
      <div className="rounded-xl border border-border bg-card overflow-hidden" style={{ height: 420 }}>
        <Suspense fallback={<div className="flex items-center justify-center h-full text-muted-foreground">Loading 3D...</div>}>
          <Canvas camera={{ position: model.camera.position, fov: 50 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <pointLight position={[-5, -5, -5]} intensity={0.3} />
            {model.objects.map((obj, i) => (
              <Object3D key={i} obj={obj} />
            ))}
            <OrbitControls enablePan enableZoom enableRotate />
            <gridHelper args={[10, 10, "#444", "#222"]} />
            <axesHelper args={[3]} />
          </Canvas>
        </Suspense>
      </div>
      <p className="text-xs text-muted-foreground italic">
        🖱️ Drag to rotate, scroll to zoom • Type: {model.type.replace(/_/g, " ")}
      </p>
    </motion.div>
  );
}
