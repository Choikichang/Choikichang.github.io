---
layout: archive
title: "프로젝트"
permalink: /ko/projects/
author_profile: true
lang: ko
---

{% include base_path %}

<div style="text-align: right; margin-bottom: 1em;">
  <a href="/projects/" style="padding: 0.5em 1em; background-color: #f0f0f0; border-radius: 5px; text-decoration: none; color: #333;">🇺🇸 English</a>
</div>

## 제방 붕괴 조기 감지를 위한 자율 진화형 AI 기반 스마트 센싱 플랫폼 (MANTA)

제방 붕괴를 조기에 감지하고 예측하기 위한 AI 기반 시스템 개발 프로젝트입니다. 과거 데이터가 제한적인 지역에서도 효과적으로 작동할 수 있는 정확한 수위 예측 모델 개발에 집중하고 있습니다.

- **MANTA 모델 개발**: 단기 수위 예측을 위한 MANTA(Multivariate Adaptive Network for Temporal Analysis) 모델 설계 및 구현
- **이질적 데이터 처리**: 서로 다른 하천 관측소 간의 불균등한 데이터 분포 문제를 해결하는 기법 개발
- **성능**: 강우 이벤트 발생 시 1시간 선행 예측에서 5cm 미만의 오차 달성
- **조기 경보 시스템 통합**: 예측 모델을 경보 시스템과 연동하여 선제적 홍수 관리 지원

## 건설 도메인 특화 RAG 시스템 기반 LLM (Construct-RAG)

건설 산업에 특화된 Retrieval-Augmented Generation (RAG) 시스템 개발 프로젝트입니다. 건설 분야의 전문적인 기술 질의에 높은 정확도로 답변할 수 있는 시스템을 구축했습니다.

- **Dataset 생성 및 전처리**: 건설 시방서와 기술 문서를 활용하여 포괄적인 학습 데이터셋 생성
- **Embedding Model Fine-tuning**: 건설 문서의 기술적 관계를 더 잘 포착하도록 손실 함수 수정 및 학습 방법 최적화
- **성능 벤치마킹**: OpenAI의 상용 text-embedding-3-large 모델을 능가하는 성능 달성
- **시스템 통합**: Fine-tuning된 Embedding Model을 Vector Database와 함께 완전한 RAG 시스템으로 구축

## Eugene 콘크리트 슬럼프 예측 프레임워크 개발

![콘크리트 슬럼프 예측 시스템](/images/Slump_Prediction.png)

레미콘 공장에서 생산되는 콘크리트의 품질을 자동으로 모니터링하고 예측하는 프레임워크 개발 프로젝트입니다. 콘크리트 슬럼프 값은 작업성과 품질을 나타내는 핵심 지표로, 이를 실시간으로 분석하는 시스템을 구축했습니다.

- **Optical Flow 기반 데이터 수집 시스템**: 공장 환경에서 콘크리트가 카메라 프레임에 진입할 때만 자동으로 영상을 저장하는 프로그램 개발
- **사용자 친화적 인터페이스**: 비전문가도 쉽게 사용할 수 있도록 PyQt와 Docker를 활용한 GUI 애플리케이션 제작
- **Deep Learning 모델 구현**: 콘크리트 특성을 시각적으로 인식하기 위한 CNN 모델 학습 및 최적화
- **실제 환경 배포**: 운영 중인 레미콘 배칭 플랜트에 시스템 성공적으로 배포

## 재료 유변학 측정을 위한 로봇 기반 자동화 Vane Testing 시스템

건설 재료의 정밀한 유변학적 측정을 위해 ABB 로봇 기술을 활용한 Vane Testing 자동화 연구 프로젝트입니다. Computer Vision과 로봇 공학을 결합하여 테스트 지점을 식별하고 제어된 회전 동작을 수행하는 시스템을 개발했습니다.

- **Computer Vision 통합**: End-effector 카메라와 Depth Sensor 시스템을 구현하여 재료와 테스트 지점을 자율적으로 감지
- **로봇 프로그래밍**: Vane Testing에 필요한 정밀하고 일관된 회전 동작을 수행하도록 ABB 로봇 코드 개발
- **유변학적 측정**: 재료 특성의 정확한 결정을 위해 일정한 회전 속도를 유지하는 시스템 구축
- **자동화 워크플로우**: 재료 감지부터 데이터 수집 및 분석까지 전체 프로세스 설계
