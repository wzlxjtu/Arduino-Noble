clear;close all;clc

% Load data
data = 'Data/log_1505342159';
pressure = xlsread([data,'.csv']);
mouse = dlmread([data,'.txt'], ' ', 6, 0);
mouse(:,end) = [];

% figure;plot(mouse(:,2),mouse(:,3))

% Get timeline
Start = mouse((mouse(:,2) == -0.1),1);
End = mouse((mouse(:,2) == -0.2),1);


% Data segment
pressure1 = pressure(pressure(:,1) > Start(1) & pressure(:,1) < End(1),:);
pressure2 = pressure(pressure(:,1) > Start(2) & pressure(:,1) < End(2),:);

% Plot raw data
figure;hold on;
plot(pressure(:,1),pressure(:,3:7),'g.')
plot(pressure1(:,1),pressure1(:,3:7),'b.')
plot(pressure2(:,1),pressure2(:,3:7),'r.')
vline(Start);vline(End)
title('raw data')

% PCA
[V,score,latent] = pca(pressure(:,3:7));
P = pressure(:,3:7) * V;
P1 = pressure1(:,3:7) * V;
P2 = pressure2(:,3:7) * V;

% Plot projected data
figure;hold on;
for i = 1 : 5
    plot(pressure(:,1),P(:,i),'.')
end
title('projected data')

% plot in PCA space
figure;hold on;
plot(P1(:,1),P1(:,2),'bo')
plot(P2(:,1),P2(:,2),'ro')
xlabel('PCA1');ylabel('PCA2')
title('PCA space')